package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.DishOptionDto;
import com.restaurant_management.dtos.DishOptionGroupDto;
import com.restaurant_management.entites.DishOption;
import com.restaurant_management.entites.DishOptionGroup;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishOptionGroupRequest;
import com.restaurant_management.payloads.requests.DishOptionRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishOptionGroupResponse;
import com.restaurant_management.repositories.DishOptionGroupRepository;
import com.restaurant_management.repositories.DishOptionRepository;
import com.restaurant_management.services.interfaces.DishOptionGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishOptionGroupServiceImpl implements DishOptionGroupService {
    private final DishOptionGroupRepository dishOptionGroupRepository;
    private final DishOptionRepository dishOptionRepository;
    private final PagedResourcesAssembler<DishOptionGroupResponse> pagedResourcesAssembler;

    @Override
    public PagedModel<EntityModel<DishOptionGroupResponse>> getAllDishOptionGroups(
            int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<DishOptionGroup> pagedResult = dishOptionGroupRepository.findAll(pageable);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(DishOptionGroupResponse::new));
        } else {
            throw new DataExitsException("No dish option group found");
        }
    }

    @Override
    @Transactional
    public ApiResponse addDishOptionGroup(DishOptionGroupDto request) throws DataExitsException {
        if (dishOptionGroupRepository.existsByGroupName(request.getGroupName())) {
            throw new DataExitsException("Dish option group with name " + request.getGroupName() + " already exists");
        }

        DishOptionGroup dishOptionGroup = new DishOptionGroup();
        dishOptionGroup.setGroupName(request.getGroupName());
        dishOptionGroup.setDescription(request.getDescription());

        dishOptionGroupRepository.save(dishOptionGroup);
        addDishOptionsToGroup(dishOptionGroup, request.getOptions());

        return new ApiResponse("Dish option group added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse addDishOptions(String groupId, List<DishOptionDto> options) throws DataExitsException {
        DishOptionGroup dishOptionGroup = dishOptionGroupRepository.findById(groupId)
                .orElseThrow(() -> new DataExitsException("Dish Option Group not found"));
        addDishOptionsToGroup(dishOptionGroup, options);

        return new ApiResponse("Dish options added successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse updateDishOptionGroup(String groupId, DishOptionGroupRequest request) throws DataExitsException {
        DishOptionGroup dishOptionGroup = dishOptionGroupRepository.findById(groupId)
                .orElseThrow(() -> new DataExitsException("Dish Option Group not found"));

        dishOptionGroup.setGroupName(request.getGroupName());
        dishOptionGroup.setDescription(request.getDescription());

        request.getOptions().forEach(optionRequest -> {
            if (optionRequest.getDishOptionId() == null) {
                addNewDishOptions(dishOptionGroup, List.of(optionRequest));
            } else {
                updateExistingDishOptions(dishOptionGroup, List.of(optionRequest));
            }
        });
        dishOptionGroupRepository.save(dishOptionGroup);

        return new ApiResponse("Dish option group updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteDishOptionGroup(String groupId) throws DataExitsException {
        if (!dishOptionGroupRepository.existsById(groupId)) {
            throw new DataExitsException("Dish Option Group not found");
        }

        dishOptionGroupRepository.deleteById(groupId);
        return new ApiResponse("Dish option group deleted successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse updateDishOption(String optionId, DishOptionDto request) throws DataExitsException {
        DishOption dishOption = dishOptionRepository.findById(optionId)
                .orElseThrow(() -> new DataExitsException("Dish Option not found"));

        if (!Objects.equals(request.getOptionName(), dishOption.getOptionName())
                && dishOptionRepository.existsByOptionName(request.getOptionName())) {
            throw new DataExitsException("Dish option with name " + request.getOptionName() + " already exists");
        }

        dishOption.setOptionName(request.getOptionName());
        dishOption.setAdditionalPrice(request.getAdditionalPrice());

        dishOptionRepository.save(dishOption);

        return new ApiResponse("Dish option updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteDishOption(String optionId) throws DataExitsException {
        if (!dishOptionRepository.existsById(optionId)) {
            throw new DataExitsException("Dish Option not found");
        }

        dishOptionRepository.deleteById(optionId);

        return new ApiResponse("Dish option deleted successfully", HttpStatus.OK);
    }

    private void addDishOptionsToGroup(DishOptionGroup dishOptionGroup, List<DishOptionDto> options) {
        if (options != null) {
            List<DishOption> dishOptions = options.stream().map(dto -> {
                if (dishOptionRepository.existsByOptionName(dto.getOptionName())) {
                    throw new RuntimeException("Dish option with name " + dto.getOptionName() + " already exists");
                }

                DishOption dishOption = new DishOption();
                dishOption.setOptionName(dto.getOptionName());
                dishOption.setAdditionalPrice(dto.getAdditionalPrice());
                dishOption.setOptionGroup(dishOptionGroup);
                return dishOption;
            }).collect(Collectors.toList());

            dishOptionRepository.saveAll(dishOptions);
        }
    }

    private void updateExistingDishOptions(DishOptionGroup dishOptionGroup, List<DishOptionRequest> newOptions) {
        for (DishOption option : dishOptionGroup.getOptions()) {
            Optional<DishOptionRequest> updatedOption = newOptions.stream()
                    .filter(opt -> opt.getDishOptionId().equals(option.getId()))
                    .findFirst();

            if (updatedOption.isPresent()) {
                if (!Objects.equals(updatedOption.get().getOptionName(), option.getOptionName())
                        && dishOptionRepository.existsByOptionName(updatedOption.get().getOptionName())) {
                    throw new RuntimeException("Dish option with name " + updatedOption.get().getOptionName() + " already exists");
                }

                option.setOptionName(updatedOption.get().getOptionName());
                option.setAdditionalPrice(updatedOption.get().getAdditionalPrice());
            }
        }
    }

    private void addNewDishOptions(DishOptionGroup dishOptionGroup, List<DishOptionRequest> newOptions) {
        List<DishOptionRequest> optionsToAdd = newOptions.stream()
                .filter(optDto -> optDto.getDishOptionId() == null)
                .toList();

        if (!optionsToAdd.isEmpty()) {
            List<DishOption> dishOptions = optionsToAdd.stream().map(dto -> {
                if (dishOptionRepository.existsByOptionName(dto.getOptionName())) {
                    throw new RuntimeException("Dish option with name " + dto.getOptionName() + " already exists in group " + dishOptionGroup.getGroupName());
                }

                DishOption dishOption = new DishOption();
                dishOption.setOptionName(dto.getOptionName());
                dishOption.setAdditionalPrice(dto.getAdditionalPrice());
                dishOption.setOptionGroup(dishOptionGroup);
                return dishOption;
            }).collect(Collectors.toList());

            dishOptionRepository.saveAll(dishOptions);
        }
    }

}
